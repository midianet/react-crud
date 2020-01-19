//Header
import React from 'react';

const Header = ({ title }) => (
    <header>
        <h1> {title ? title : 'Escolha um Título'} </h1>
    </header>
);

export default Header;