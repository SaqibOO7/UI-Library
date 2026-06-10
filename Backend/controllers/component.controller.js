import { Component } from "../models/component.model.js"
import { User } from "../models/user.model.js"
import path from 'path'
import fs from 'fs'
import { execSync } from "child_process"


export const saveComponents = async (req, res) => {
    try {
        const { name, code, props } = req.body

        const user = await Users.findById(req.userId)
        if (!user) {
            return res.status(404).json({ message: "user is not found" })
        }

        if (user.role === "admin") {
            const existing = await Component.findOne({ name, visibility: "public" })
            if (existing) {
                return res.status(400).json({
                    message: "Admin cannot create duplicate public component name",
                });
            }
        }

        if (user.role !== "admin") {
            const existing = await Component.findOne({
                name,
                owner: req.userId,
            });

            if (existing) {
                return res.status(400).json({
                    message: "You already have a component with this name",
                });
            }
        }

        const component = await Component.create({
            name,
            code,
            props,
            owner: req.userId
        })
        return res.status(200).json(component)

    } catch (error) {
        return res.status(500).json({ message: `Failed to save component: ${error}` })
    }
}


export const publishComponent = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                message: "Only admin can publish"
            });
        }

        const { componentId } = req.body

        const component = await Component.findById(componentId)
        if (!component) {
            return res.status(404).json({
                message: "component not found"
            })
        }

        if (component.owner.toString() !== req.userId.toString()) {
            return res.status(403).json({ message: "You can only publish your own components" })
        }

        // Doing the automation part going to the library folder
        const libPath = path.join(process.cwd(), "../Virtual-Lib");

        const componentDir = path.join(
            libPath,
            "src/components",
            component.name
        );

        const componentFile = path.join(
            componentDir,
            `${component.name}.jsx`
        );

        const indexFile = path.join(libPath, "src/index.js");

        // create component folder
        if (!fs.existsSync(componentDir)) {
            fs.mkdirSync(componentDir, { recursive: true });
        }

        // write component code
        fs.writeFileSync(componentFile, component.code);

        // read index file
        let indexContent = fs.readFileSync(indexFile, "utf8");

        const exportLine =
            `export { ${component.name} } from "./components/${component.name}/${component.name}.jsx";`;

        // prevent duplicate export
        if (!indexContent.includes(exportLine)) {
            fs.appendFileSync(indexFile, `\n${exportLine}\n`);
        }

        // ------------------------------
        // CLEAN OLD BUILD
        // ------------------------------
        console.log("Cleaning old build...");

        const distPath = path.join(libPath, "dist");

        if (fs.existsSync(distPath)) {
            fs.rmSync(distPath, { recursive: true, force: true });
        }

        // ------------------------------
        // BUILD LIBRARY
        // ------------------------------
        console.log("Building library...");

        execSync("npm run build", {
            cwd: libPath,
            stdio: "inherit"
        });

        // ------------------------------
        // UPDATE VERSION
        // ------------------------------
        console.log("Updating version...");

        execSync("npm version patch --no-git-tag-version", {
            cwd: libPath,
            stdio: "inherit"
        });

        // ------------------------------
        // PUBLISH TO NPM
        // ------------------------------
        console.log("Publishing to npm...");

        execSync("npm publish --access public", {
            cwd: libPath,
            stdio: "inherit"
        });

        component.visibility = "public"
        component.npmPackage = "custombuild-ui-library"

        await component.save()

        return res.status(200).json({message: "component published successfully"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Component published error"})
    }
}