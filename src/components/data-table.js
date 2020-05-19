import React from 'react';
import ReactDataTable, {createTheme} from 'react-data-table-component';
import LinkDriver from './link/driver';
import LinkTeam from './link/team';

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

const DataTable = props => (
    <ReactDataTable
        {...props}
        noHeader={true}
        striped={true}
        theme="uk-table"
        customStyles={customStyles}/>
);

export const positionCell = {
    name: (() => {
        return <abbr title="Position">Pos</abbr>;
    })(),
    center: true,
    grow: 0,
    selector: 'position',
    cell: row => {
        const {positionText, position} = row;
        return positionText || position;
    }
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
    cell: row => {
        const {Driver} = row;
        return <LinkDriver driver={Driver}/>;
    }
};

export const teamCell = {
    name: 'Car',
    cell: row => {
        const {Constructor, Constructors} = row;
        const constructors = Constructors || [Constructor];

        return (
            <div>
                {constructors.map((constructor, i) => (
                    <div key={i}>
                        <LinkTeam constructor={constructor}/>
                    </div>
                ))}
            </div>
        );
    }
};

export const lapsCell = {
    name: 'Laps',
    selector: 'laps',
    center: true
};

export const timeCell = {
    name: 'Time',
    cell: row => {
        const {Time, status} = row;
        return Time?.time || status || '--:--';
    }
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

export default DataTable;
