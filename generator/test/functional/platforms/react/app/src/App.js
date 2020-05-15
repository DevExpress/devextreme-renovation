import React from 'react';
import App from '../../../../components/app.tsx';
import ButtonWithTemplate from "../../../../components/button-with-template.tsx"

const buttonTemplate = ({ text }) => <div style={{border: "1px solid blue"}}>
    {text+"!"}
</div>

export default () =>
    (<div>
        <App></App>
        <ButtonWithTemplate
            text={"With Template"}
            render={buttonTemplate}
        ></ButtonWithTemplate>

        <ButtonWithTemplate
            text={"Without Template"}
        ></ButtonWithTemplate>
    </div>);
