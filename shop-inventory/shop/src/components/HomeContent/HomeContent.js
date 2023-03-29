import React from 'react'
import BoardContent from './BoardContent/BoardContent'
import TopNav from '../UIElements/TopNav/TopNav'
import './HomeContent.css'
const HomeContent = () => {
    return (
        <div className="home-content" >
            <TopNav heading="DashBoard" />
            <BoardContent />
        </div>
    )
}

export default HomeContent
