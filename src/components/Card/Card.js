import React from 'react';
import "./Card.css";

const Card = ({ pokemon }) => {
  return (
    <div className="Card">
      <div className='CardImg'>
        <img src={pokemon.image} alt={pokemon.name} />
      </div>

      <h3 className='CardName'>{pokemon.name}</h3>

      <div className='cardTypes'>
        <div>タイプ:</div>
        {pokemon.types.map(type => (
          <span key={type.name} className='typeName'>{type.name}</span>
        ))}
      </div>

      <div className='CardInfo'>
        <div className='CardData'>
          <p>重さ: {pokemon.weight}</p>
        </div>
        <div className='CardData'>
          <p>高さ: {pokemon.height}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;