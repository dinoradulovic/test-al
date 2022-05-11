import chai from 'chai';
import chaiHttp from 'chai-http';

import { init } from "../bin/www";

import "../features/users/tests/integration/users-api.spec";

chai.should();
chai.use(chaiHttp);

// gets executed before all tests
before(async function () {
  await init();
});
