import React from 'react';

export default function DriverAchievements() {
    const rows = [
        ['Titles', 0],
        ['Entries', 0],
        ['Starts', 0],
        ['Poles', 0],
        ['Wins', 0],
        ['Podiums', 0],
        ['Points', 0]
        // ['Fastest Laps', 0]
    ];

    return (
        <>
            {rows.map(([label, qty]) =>
                <div
                    key={label}
                    data-uk-grid=""
                    className="uk-grid-small uk-text-uppercase">
                    <div className="uk-width-expand" data-uk-leader="">
                        {label}
                    </div>
                    <div className="uk-text-bold">{qty}</div>
                </div>
            )}
        </>
    );
}
