import { useState } from 'react'
import FacialExpression from "./components/FacialExpression";
import MoodSongs from './components/MoodSongs';
import './App.css'

 

function App() {
  const [songs, setsongs]= useState([

    ])

  return (
  <>
    <FacialExpression setsongs={setsongs}/>;
    <MoodSongs songs={songs}/>
  </>
  )
}


export default App
