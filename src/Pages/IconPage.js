import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IconPage = ({ icon }) => {
  return (
    <div>      
      <FontAwesomeIcon icon={icon} />
    </div>
  );
}

export default IconPage;