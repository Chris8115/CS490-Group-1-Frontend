function DashboardItem(props) {
    return <>
    
        <div style={{ display: 'flex', flexDirection: "column", alignContent: "flex-start" }}>
            <h2>{props.itemName}</h2>
            <p>{props.itemDescription}</p>
        </div>

    </>
}

export default DashboardItem;