import React, { memo } from "react";

function BookContentBody({ body, formFontSize }) {
  return <div style={{ fontSize: `${formFontSize}em` }} dangerouslySetInnerHTML={{ __html: body }}></div>;
}

export default memo(BookContentBody);
