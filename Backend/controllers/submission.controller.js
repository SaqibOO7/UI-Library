import { Component } from '../models/component.model.js'
import { User } from '../models/user.model.js'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'

// 1. GET - Get user's draft components (for submit page)
export const getUserComponents = async (req, res) => {
  try {
    const userId = req.userId

    const components = await Component.find({
      owner: userId,
      status: { $in: ["draft", "rejected", "submitted", "approved"] }  // ✅ UPDATED - includes submitted and approved
    })
      .select("_id name code props status submissionDescription rejectionReason")
      .sort({ createdAt: -1 })

    res.status(200).json(components)

  } catch (error) {
    console.error("Error fetching user components:", error)
    res.status(500).json({ message: "Failed to fetch components" })
  }
}

// 2. POST - Submit component for approval
export const submitForApproval = async (req, res) => {
  try {
    const { componentId, description } = req.body
    const userId = req.userId

    // Validation
    if (!componentId) {
      return res.status(400).json({ message: "Component ID is required" })
    }

    // Find component
    const component = await Component.findById(componentId)

    if (!component) {
      return res.status(404).json({ message: "Component not found" })
    }

    // Check if user is owner
    if (component.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only submit your own components" })
    }

    // Check if component is already submitted or approved
    if (component.status === "submitted") {
      return res.status(400).json({ message: "This component is already under review" })
    }

    if (component.status === "approved") {
      return res.status(400).json({ message: "This component is already approved" })
    }

    // Update component
    component.status = "submitted"
    component.submittedAt = new Date()
    component.submissionDescription = description || ""

    await component.save()

    res.status(200).json({
      message: "Component submitted for approval successfully!",
      component
    })

  } catch (error) {
    console.error("Error submitting component:", error)
    res.status(500).json({ message: "Failed to submit component" })
  }
}

// 3. GET - Get all pending submissions (Admin only)
export const getPendingSubmissions = async (req, res) => {
  try {
    const admin = await User.findById(req.userId)
    if (!admin) {
      return res.status(404).json({ message: "user is not found" })
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Only admins can view pending submissions" })
    }

    const pendingComponents = await Component.find({ status: "submitted" })
      .populate("owner", "name email aiCredits")
      .select("_id name code props status submittedAt submissionDescription owner")
      .sort({ submittedAt: 1 })  // Oldest first (first submitted)

    res.status(200).json(pendingComponents)

  } catch (error) {
    console.error("Error fetching pending submissions:", error)
    res.status(500).json({ message: "Failed to fetch pending submissions" })
  }
}

// 4. POST - Publish component to npm (helper function)
export const publishComponent = async (userId, componentId) => {
  try {
    const user = await User.findById(userId)
    if (!user || user.role !== "admin") {
      throw new Error("Only admin can publish")
    }

    const component = await Component.findById(componentId)
    if (!component) {
      throw new Error("Component not found")
    }

    // ✅ REMOVED OWNERSHIP CHECK - Admin can publish any component

    // Doing the automation part going to the library folder
    const libPath = path.join(process.cwd(), "../Virtual-Lib")

    const componentDir = path.join(
      libPath,
      "src/components",
      component.name
    )

    const componentFile = path.join(
      componentDir,
      `${component.name}.jsx`
    )

    const indexFile = path.join(libPath, "src/index.js")

    // create component folder
    if (!fs.existsSync(componentDir)) {
      fs.mkdirSync(componentDir, { recursive: true })
    }

    // write component code
    fs.writeFileSync(componentFile, component.code)

    // read index file
    let indexContent = fs.readFileSync(indexFile, "utf8")

    const exportLine =
      `export { ${component.name} } from "./components/${component.name}/${component.name}.jsx";`

    // prevent duplicate export
    if (!indexContent.includes(exportLine)) {
      fs.appendFileSync(indexFile, `\n${exportLine}\n`)
    }

    // Clean old build
    console.log("Cleaning old build...")
    const distPath = path.join(libPath, "dist")

    if (fs.existsSync(distPath)) {
      fs.rmSync(distPath, { recursive: true, force: true })
    }

    // Build library
    console.log("Building library...")
    execSync("npm run build", {
      cwd: libPath,
      stdio: "inherit"
    })

    // Update version
    console.log("Updating version...")
    execSync("npm version patch --no-git-tag-version", {
      cwd: libPath,
      stdio: "inherit"
    })

    // Publish to npm
    console.log("Publishing to npm...")
    execSync("npm publish --access public", {
      cwd: libPath,
      stdio: "inherit"
    })

    component.npmPublished = true
    component.npmPackage = "custombuild-ui-library"

    await component.save()

    console.log("Component published to npm successfully!")
    return true

  } catch (error) {
    console.error("Error publishing component to npm:", error.message)
    throw error
  }
}

// 5. POST - Admin approves component (UPDATED with npm publish)
export const approveComponent = async (req, res) => {
  try {
    const { componentId, reviewNotes } = req.body
    const admin = await User.findById(req.userId)
    if (!admin) {
      return res.status(404).json({ message: "user is not found" })
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Only admins can approve components" })
    }

    if (!componentId) {
      return res.status(400).json({ message: "Component ID is required" })
    }

    // Find component
    const component = await Component.findById(componentId)

    if (!component) {
      return res.status(404).json({ message: "Component not found" })
    }

    if (component.status !== "submitted") {
      return res.status(400).json({ message: "Only submitted components can be approved" })
    }

    // Get component owner
    const componentOwner = await User.findById(component.owner)

    if (!componentOwner) {
      return res.status(404).json({ message: "Component owner not found" })
    }

    // Update component
    component.status = "approved"
    component.visibility = "public"
    component.reviewedAt = new Date()
    component.reviewNotes = reviewNotes || ""

    await component.save()

    // Award AI credits to owner (100 credits for approval)
    const APPROVAL_CREDITS = 100
    componentOwner.aiCredits += APPROVAL_CREDITS
    await componentOwner.save()

    // ✅ PUBLISH TO NPM
    try {
      console.log(`Publishing component ${componentId} to npm...`)
      await publishComponent(req.userId, componentId)

      res.status(200).json({
        message: `Component approved and published to npm! User received ${APPROVAL_CREDITS} AI Credits`,
        component,
        userCredits: componentOwner.aiCredits
      })

    } catch (publishError) {
      console.error("Failed to publish to npm:", publishError.message)
      
      // ✅ Don't fail the approval if npm publish fails - still return success
      res.status(200).json({
        message: `Component approved! User received ${APPROVAL_CREDITS} AI Credits. (NPM publish will be retried)`,
        component,
        userCredits: componentOwner.aiCredits,
        npmPublishError: publishError.message
      })
    }

  } catch (error) {
    console.error("Error approving component:", error)
    res.status(500).json({ message: "Failed to approve component" })
  }
}

// 6. POST - Admin rejects component
export const rejectComponent = async (req, res) => {
  try {
    const { componentId, rejectionReason, reviewNotes } = req.body
    const admin = await User.findById(req.userId)
    if (!admin) {
      return res.status(404).json({ message: "user is not found" })
    }

    // Check if user is admin
    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Only admins can reject components" })
    }

    if (!componentId) {
      return res.status(400).json({ message: "Component ID is required" })
    }

    if (!rejectionReason) {
      return res.status(400).json({ message: "Rejection reason is required" })
    }

    // Find component
    const component = await Component.findById(componentId)

    if (!component) {
      return res.status(404).json({ message: "Component not found" })
    }

    if (component.status !== "submitted") {
      return res.status(400).json({ message: "Only submitted components can be rejected" })
    }

    // Update component
    component.status = "rejected"
    component.reviewedAt = new Date()
    component.rejectionReason = rejectionReason
    component.reviewNotes = reviewNotes || ""
    component.submittedAt = null  // Clear submission timestamp on rejection

    await component.save()

    res.status(200).json({
      message: "Component rejected successfully",
      component
    })

  } catch (error) {
    console.error("Error rejecting component:", error)
    res.status(500).json({ message: "Failed to reject component" })
  }
}