import React from "react";
import "./ContactMe.css";
import { MMP_Info } from "./data";
function ContactMe() {
  return (
    <div className="container-contactme">
      <p>contact me</p>
      <div>
        {MMP_Info.map((item) => {
          return (
            <div className="socialMedia" key={item.id}>
              <a target="_blank" href={item.socialMedia.url}>
                {item.socialMedia.icon}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactMe;
