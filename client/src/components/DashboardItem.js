import './DashboardItem.css'

function DashboardItem(props) {
    return <>
    <a href={props.href}>
        <div style = {{ display: 'flex', flexDirection: "row", alignContent: "flex-start"}}>
            <img src={  require( '../assets/DashboardTestIcon.png' )    } />

            <div style={{ display: 'flex', flexDirection: "column", justifyContent: "center" }}>
                <h2>{props.itemName}</h2>
                <p>{props.itemDescription}</p>
            </div>
        
        </div>
    </a>

    </>
}

export default DashboardItem;