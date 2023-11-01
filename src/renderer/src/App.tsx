import * as GlobalComps from './views/comps'
import { Route, Routes } from 'react-router-dom'
import { Home, Welcome } from './views/pages'
import { Toaster } from 'react-hot-toast'

function App(): JSX.Element {
  return (
    <>
      <GlobalComps.LoadingGate>
        <GlobalComps.Navbar />
        <GlobalComps.Container>
          <Routes>
            <Route element={<GlobalComps.Protect />}>
              <Route index element={<Welcome />} />
              <Route path="home" element={<Home />} />
            </Route>
          </Routes>
        </GlobalComps.Container>
      </GlobalComps.LoadingGate>
      <Toaster />
    </>
  )
}

export default App
