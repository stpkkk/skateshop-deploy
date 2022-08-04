//Context API
import React from "react";

const AppContext = React.createContext({}); // Если этот обьект измениться reaсt оповестит все другие компоненты, которые зависят от этого обьекта. ИЛИ Если AppCOntext измениться все актуальные данны сохрани в state и делай rerender

export default AppContext;
