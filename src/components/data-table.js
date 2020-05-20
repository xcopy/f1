import React from 'react';
import moment from 'moment';
import {Link} from 'react-router-dom';
import ReactDataTable, {createTheme} from 'react-data-table-component';
import LinkDriver from './link/driver';
import DriverTeams from './driver/teams';

const textColor = '#666';
const cellPadding = '16px 12px';
const customStyles = {
    cells: {
        style: {
            padding: cellPadding,
            lineHeight: 1.5
        }
    },
    rows: {
        style: {
            fontSize: 16
        }
    },
    headCells: {
        style: {
            fontSize: '.875rem',
            padding: cellPadding,
            textTransform: 'uppercase',
            color: '#999'
        }
    }
};

createTheme('uk-table', {
    text: {
        primary: textColor,
        secondary: textColor
    },
    striped: {
        text: textColor
    }
});

export default function DataTable(props) {
    return <ReactDataTable
        {...props}
        noHeader={true}
        striped={true}
        theme="uk-table"
        customStyles={customStyles}/>
}

export const roundCell = {
    name: 'Round',
    selector: 'round',
    center: true,
    grow: 0
};

export const dateCell = {
    name: 'Date',
    selector: 'date',
    format: ({date}) => moment(date).format('DD MMM YYYY')
};

export const raceCell = {
    name: 'Grand Prix',
    selector: 'raceName',
    cell: ({season, round, raceName}) => (
        <Link to={`/${season}/results/${round}`}>{raceName}</Link>
    )
};

export const locationCell = {
    name: 'Location',
    grow: 2,
    cell: row => {
        const {
            Circuit: {
                circuitName,
                Location: {country, locality}
            }
        } = row;

        return (
            <div>
                <div>{circuitName}</div>
                <div>{locality}, {country}</div>
            </div>
        );
    }
}

export const positionCell = {
    name: (() => {
        return <abbr title="Position">Pos</abbr>;
    })(),
    center: true,
    grow: 0,
    selector: 'position',
    cell: ({positionText, position}) => positionText || position
};

export const numberCell = {
    name: (() => {
        return <abbr title="Number">No</abbr>;
    })(),
    selector: 'number',
    center: true,
    grow: 0
};

export const nationalityCell = {
    name: 'Nationality',
    selector: 'nationality'
};

export const driverCell = {
    name: 'Driver',
    cell: ({Driver}) => (
        <LinkDriver driver={Driver}/>
    )
};

export const teamCell = {
    name: 'Car',
    cell: ({Constructor, Constructors}) => (
        <DriverTeams teams={Constructors || [Constructor]}/>
    ),
    style: {
        display: 'block'
    }
};

export const lapsCell = {
    name: 'Laps',
    selector: 'laps',
    center: true
};

export const timeCell = {
    name: 'Time',
    cell: ({Time, status}) => Time?.time || status || '--:--'
};

export const winsCell = {
    name: 'Wins',
    selector: 'wins',
    center: true
};

export const pointsCell = {
    name: 'Points',
    selector: 'points',
    center: true,
    style: {
        fontWeight: 'bold'
    }
};

