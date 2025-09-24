import React from 'react'
import { useParams } from "react-router-dom";
import UpdateAllowedAffiliates from './UpdateAllowedAffiliates';


export const AffiliateTab1 = () => {
const { id } = useParams();
  return (
    <div><UpdateAllowedAffiliates compaignId={id}/></div>
  )
}
