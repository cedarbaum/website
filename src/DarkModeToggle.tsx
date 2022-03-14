import styled from '@emotion/styled';
import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'

export interface DarkModeToggleProps {
    toggled?: boolean
    onToggle?(checked: boolean): void
}

interface BallProps {
    isChecked?: boolean
}

// Based on: https://codepen.io/FlorinPop17/pen/XWWZYYG
export const DarkModeToggle: React.FC<DarkModeToggleProps> = (props) => {

    const [isSelected, setIsSelected] = useState(props.toggled)
    const checked = props.toggled !== undefined ? props.toggled : isSelected

    return <div>
        <Checkbox checked={checked} type="checkbox" id="chk" onChange={(e) => {
            setIsSelected(e.target.checked)
            props.onToggle && props.onToggle(e.target.checked)
        }
        } />
        <Label htmlFor="chk">
            <FontAwesomeIcon icon={faMoon} color={'#f1c40f'} />
            <FontAwesomeIcon icon={faSun} color={'#f39c12'} />
            <Ball isChecked={checked} />
        </Label>
    </div>
};

const Checkbox = styled.input({
    opacity: 0,
    position: 'absolute',
})

const Label = styled.label({
	backgroundColor: '#111',
	borderRadius: '50px',
	cursor: 'pointer',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '5px',
	position: 'relative',
	height: '26px',
	width: '50px',
	transform: 'scale(1.5)',
    boxSizing: 'border-box',
})

const Ball = styled.div<BallProps>(props => ({
	backgroundColor: '#fff',
	borderRadius: '50%',
	position: 'absolute',
	top: '2px',
	left: '2px',
	height: '22px',
	width: '22px',
	transform: `translateX(${props.isChecked ? 24 : 0}px)`,
    transition: 'transform 0.2s linear',
}))