import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setRequestTable } from "../actions";
import { FilterButtons } from '../filterButtons';
import { getReqPool3 } from '../serverUtils'; //TODO refactor name when done
import { RequestBoxTemp } from "./requestBoxTemp";



export const RequestTableTemp = (props) => { //props: not yet, add filter
    
    const storedRequestTable = useSelector(state => state.requestTable.requestTable);
    const dispatch = useDispatch();
    const [filter, setFilter] = useState(
        //props.filter
        "TODO"
    )
//setFilterCallback
    useEffect(() => {
        dispatch(setRequestTable())
    }, [])

        const generateRequestBoxes = () => {
        let requests = [];
        Object.keys(storedRequestTable).forEach(function (key){
            if (filter=="TODO" && !storedRequestTable[key].done) {
                requests.push(<RequestBoxTemp key={key} id={key} ></RequestBoxTemp>);
            }
            if (filter=="DONE" && storedRequestTable[key].done) {
                requests.push(<RequestBoxTemp key={key} id={key} ></RequestBoxTemp>);
            }
            if (filter=="ALL") {
                requests.push(<RequestBoxTemp key={key} id={key} ></RequestBoxTemp>);
            }  
            
        })
        return requests;
    }

    return (
        <span className="tempReqTable">
         
             <h3 style={{ textAlign: 'center', color: 'black' }}> <u>Request Pool  </u> </h3>
             <br />
            <FilterButtons setFilterCallback= {setFilter}/>
            <br/>
            {generateRequestBoxes()}
        </span >
    );
}


