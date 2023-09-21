import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BinPage = () => {
    const { bid } = useParams()

    return (
        <>
            <p>The Bin ID is {bid}</p>
        </>
    )
}

export default BinPage;