import { useEffect, useState } from 'react';
import Card from './Card'
import './App.css';


function App() {

  const [pokemonList, setPokemonList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [overlayClass, setOverlay] = useState("overlay");

  const filterPokemon = e => {
    setFilteredList(pokemonList.filter(pokemon => {
      let value = e.target.value.toLowerCase().replace(/\s+/g, '');
      return (pokemon.name.includes(value) || pokemon.types[0].type.name.includes(value)  || (pokemon.types.length>1?pokemon.types[1].type.name.includes(value):false ));
    }));
  }

  const addFavorite = () => {

  }

  const removeFavorite = () => {

  }

  useEffect(()=>{
    const getAllPokemonList = async () => {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=151`);
      const data = await response.json();
      //console.log(data.results);
      //setPokemonList(data.results);

      const promises = data.results.map(pokemon => {
        return fetch(pokemon.url)
          .then(response=> {
          return response.json()
        });
      });
    
      Promise.all(promises).then(results => {
        const pokemons = results.map(result => result);
        console.log(pokemons);
        setPokemonList(pokemons);
        setFilteredList(pokemons);
      })
    }
    getAllPokemonList();
  }, []);

  const mycallback = (e) => {
    setOverlay(e);
    return;
    if (e=="overlay-modal"){ 
      let oldWidth = document.body.offsetWidth;
      document.body.classList.add('modal-open');
      document.body.style.width = oldWidth + "px";
    } else {
      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.width = "auto";      
    }, 400);
    }    
  }

  useEffect(() => {
    function handleResize() {
      console.log('resized to: ', window.innerWidth, 'x', window.innerHeight)
      document.body.style.width = "auto";
}

    window.addEventListener('resize', handleResize)
  })

  return (
    <div className="App">
      <div className={overlayClass}></div>
      <div className="search-box">
        <input className="searchBar" placeholder="Start typing to search by name or type" type="text" onChange={filterPokemon}></input>
      </div>
      <div className="poke-grid">
        {filteredList.map((pokemon,index) => (
          <Card pokemon={pokemon} index={index} key={pokemon.id} callback={mycallback} />
        ))
        }
      </div>
    </div>
  );
}

export default App;
