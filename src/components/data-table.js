import React from 'react';
import ReactDataTable, {createTheme} from 'react-data-table-component';

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
