import React from 'react';
import '../css/DashboardItem.css';

// itemName: The big bold text
// itemDescription: The expanded text
// icon: The asset in the ./assets/ folder used
// href: The page the DashboardItem links to
function DashboardItem(props) {
    return (
        <a href={props.href} className="dashboard-item-link">
            <div className="dashboard-item">
                <img
                    src={require(`../assets/${props.icon}.png`)}
                    alt={props.itemName}
                    className="dashboard-icon"
                />

                <div className="dashboard-text">
                    <h2>{props.itemName}</h2>
                    <p>{props.itemDescription}</p>
                </div>
            </div>
        </a>
    );
}

export default DashboardItem;
