import {ThreeDots} from "react-loader-spinner";
import React from "react";

export const LoadingIcon = ({isLoading}) => {
  const classes = "loading-icon-canvas flex-center " + (isLoading ? 'active' : 'inactive')
  return (
    <div className={classes}>
      <div className={"loading-icon"}>
      <ThreeDots
        height="100"
        width="100"
        radius="9"
        color="#e30019"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
      </div>
    </div>
  )
}
