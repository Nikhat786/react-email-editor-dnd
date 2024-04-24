import React from 'react'
import {Link } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn} from 'mdb-react-ui-kit';
function Dashboard() {
    const EmailTemps= JSON.parse(localStorage.getItem('newsletter'))
  return (
    <div className="export_button">
   <Link to='/EmailEditor'><MDBBtn>Create New template </MDBBtn></Link>
   {EmailTemps?.map((row, index) =>(<MDBCard>
      <MDBCardBody>
        <MDBCardTitle>Card title</MDBCardTitle>
        <MDBCardText>
          Some quick example text to build on the card title and make up the bulk of the card's content.
        </MDBCardText>
        <MDBBtn>Button</MDBBtn>
      </MDBCardBody>
    </MDBCard>))}
  </div>
  )
}

export default Dashboard