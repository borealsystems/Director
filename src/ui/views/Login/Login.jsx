import React from 'react'
import {
  BrowserRouter as Router,
  Switch
} from 'react-router-dom'
import HeaderContainer from 'carbon-components-react/lib/components/UIShell/HeaderContainer'
import {
  Content,
  Header,
  HeaderMenuButton,
  HeaderName,
  SkipToContent
} from 'carbon-components-react/lib/components/UIShell'

const ControlPanel = () => (
  <div className="container">
    <Router>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <>
            <Header aria-label="IBM Platform Name">
              <SkipToContent />
              <HeaderMenuButton
                aria-label="Open menu"
                onClick={onClickSideNavExpand}
                isActive={isSideNavExpanded}
              />
              <HeaderName href="#" prefix='Boreal Systems'>
                Director
              </HeaderName>
            </Header>
            <Switch>
              <Content id="main-content">
                <h1
                  style={{
                    margin: '0 0 32px 0'
                  }}
                >
                  Log In
                </h1>
              </Content>
            </Switch>
          </>
        )}
      />
    </Router>
  </div>
)

export default ControlPanel
