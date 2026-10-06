import { layout } from "jops-core";

export default layout`
<link rel="stylesheet" href="./src/css/styles.css">

<div class="jops-root">

    <View jops layout="/src/layout/layout_header.js"></View>

    <main class="main">

      <Router jops animation="slide">

        <View path="/home" jops layout="/src/layout/layout_hero.js"></View>

        <Features path="/features" jops
           src="/src/Features.js">
        </Features>

        <Form path="/form" jops
           src="/src/Form.js">
        </Form>

        <DataSection path="/data" jops
           src="/src/DataSection.js">
        </DataSection>

        <Media path="/media" jops
           src="/src/Media.js">
        </Media>
       
      </Router>

    </main>

    <View jops layout="/src/layout/layout_footer.js"></View>

</div>
`;
