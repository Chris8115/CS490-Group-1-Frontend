import './DashboardItem.css'

// itemName: The big bold text
// itemDescription: The expanded text
// icon: The asset in the ./assets/ folder used
// href: The page the DashboardItem links to
function DashboardItem(props) {
    return <>
    <a href={props.href}>
        <div style = {{ display: 'flex', flexDirection: "row", alignContent: "flex-start"}}>
            <img src={  require( '../assets/' + props.icon + '.png' )    } />

            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center" }}>
                <h2>{props.itemName}</h2>
                <p>{props.itemDescription}</p>
            </div>
        
        </div>
    </a>

    </>
}

export default DashboardItem;