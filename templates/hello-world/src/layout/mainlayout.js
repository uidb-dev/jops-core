import { layout } from "jops-core";

export default layout`
<link rel="stylesheet" href="./src/css/styles.css">

<div class="jops-root">

    <View type="jops" layout="/src/layout/layout_header.js"></View>

    <main class="main">

      <Router type="jops" animation="slide">

        <View path="/home" type="jops" layout="/src/layout/layout_hero.js"></View>

        <Features path="/features" type="jops"
           src="/src/Features.js">
        </Features>

        <Form path="/form" type="jops"
           src="/src/Form.js">
        </Form>

        <DataSection path="/data" type="jops"
           src="/src/DataSection.js">
        </DataSection>

        <Media path="/media" type="jops"
           src="/src/Media.js">
        </Media>
       
      </Router>

    </main>

    <View type="jops" layout="/src/layout/layout_footer.js"></View>

</div>
`;
