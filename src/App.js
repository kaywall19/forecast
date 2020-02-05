import React, { useContext, useState } from 'react';
import './App.css';
import { Input, Button } from "antd"

const context = React.createContext()

function App() {
  const [state, setState] = useState({searchTerm:""})
  return <context.Provider value = {{
    ...state,
    set: v=> setState({...setState, ...v})
  }} >
    <div className="App">
      <Header/>
      {state.error && <div>{state.error}</div>}
    </div>
  </context.Provider>
}

function Header() {
  const ctx = useContext(context)
  return <header className="App-header">
    <Input 
      value={ctx.searchTerm}
      onChange={e=> ctx.set({searchTerm:e.target.value})}
      style={{height:"3rem", fontSize:"2rem"}}
      onKeyPress={e=>{
        if (e.key==="Enter" && ctx.searchTerm) search(ctx)
      }}
    />
    <Button 
      style={{marginLeft:10, height:"3rem"}}
      onClick={()=> search(ctx)}
      type = "primary"
      disabled={!ctx.searchTerm}>
      Search
    </Button>
  </header>
}

async function search({searchTerm, set}) {
  try {
    const term = searchTerm
    set({searchTerm:"", error:""})
    
    const osmurl = `https://nominatim.openstreetmap.org/search/${term}?format=json`
    const r = await fetch(osmurl)
    const location = await r.json()
    if (!location[0]) {
      return set({error:"No city matching that query"})
    }
    const city = location[0]
  
    const key = "9bf967291f39821291ecb98396587b4a"
    const url = `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/${key}/${city.lat},${city.lon}`
    const r2 = await fetch(url)
    const weather = await r2.json()
    set({weather})
  } catch (err) {
    set({error: err.message})
  }


}

export default App;
