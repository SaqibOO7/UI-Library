import React, { useState } from 'react'
import {
    TbUsers, TbCode, TbLogout, TbPlus, TbLayoutDashboard,
    TbPackage, TbX, TbTrash, TbDeviceFloppy, TbUpload,
    TbEye, TbCodeDots, TbLoader, TbMenu2, TbChevronLeft,
    TbWorld, TbSearch, TbBoxOff,
} from "react-icons/tb";
import { SiValorant } from "react-icons/si";
import axios from 'axios'
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../store/userSlice';


function SideBarContent() {


    const [activeView, setActiveView] = useState('dashboard')
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const navItems = [
        { id: "dashboard", label: "Dashboard", Icon: TbLayoutDashboard },
        { id: "add", label: "Add Component", Icon: TbPackage },
    ];

    const handleLogout = async () => {
        try {
            await axios.get(serverUrl + "/api/v1/auth/logout", { withCredentials: true })
            dispatch(setUserData(null))
            navigate('/')

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='flex items-center gap-2.5 px-5 py-5 border-b border-white/[0.05]'>
                <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-[#3be8ff] to-[#0ab5d4] flex
                 items-center justify-center shadow-[0_0_14px_rgba(59,232,255,0.4)] flex-shrink-0'>
                    <SiValorant size={15} color="#051c20" />
                </div>
                <div>
                    <span className='text-base font-bold block'>VirtualUI</span>
                    <span className='text-[10px] text-[#3be8ff]/60 font-semibold tracking-[2px] uppercase'>Admin</span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className='ml-auto md:hidden bg-transparent border-none cursor-pointer p-1.5 rounded-lg
                         text-white/40 hover:text-white/70 transition-colors'>
                        <TbChevronLeft size={18} />
                    </button>
                </div>
            </div>

            <nav className='flex-1 px-3 py-4 space-y-1'>

                {navItems.map(({ id, label, Icon }) => {
                    const isActive = activeView === id;
                    return (
                        <button key={id}
                            onClick={() => setActiveView(id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium 
                            transition-all bg-transparent border-none cursor-pointer text-left"
                            style={{
                                background: isActive ? "rgba(59,232,255,0.08)" : "transparent",
                                color: isActive ? "#3be8ff" : "rgba(255,255,255,0.45)",
                                borderLeft: isActive ? "2px solid #3be8ff" : "2px solid transparent",
                            }}>
                            <Icon size={16} style={{ opacity: isActive ? 1 : 0.7 }} />
                            {label}

                        </button>
                    )
                })}
            </nav>

            <div className='p-3 border-t border-white/[0.05]'>
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70
                 hover:text-red-400 hover:bg-red-500/[0.06] transition-all cursor-pointer bg-transparent 
                 border-none text-left'>
                    <TbLogout size={16} /> LogOut
                </button>
            </div>
        </>
    )
}

export default SideBarContent
