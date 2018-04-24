import React from 'react';

import favoriteOn from '../../images/icon-favorite.svg';
import favoriteOff from '../../images/icon-favorite-off.svg';


const FavoriteIcon = ({props}) => {
  const { id } = props.artists.selectedUnit;

  let icon = favoriteOff;
  const isFavorite = props.artists.userFavoriteArtists.findIndex(el => el.id === id);
  if (isFavorite !== -1) {
    icon = favoriteOn;
  }

  return (
    <button
      className="icon-favorite"
      onClick={() => props.updateFavoriteUnits(id)}
    >
      <img
        className="icon-favorite-svg"
        src={icon}
        alt="Favorite Unit"
      />
    </button>
  );
};

export default FavoriteIcon;
