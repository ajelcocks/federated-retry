'use strict'

const { expect } = require('chai');
const { describe } = require('mocha');
const FederatedReloadWebpackPlugin = require("../index.js");

describe('canary test', () => {
  it('should sing', async () => {
    expect(true).to.be.true;
  })
});

// describe('An async test should return a promise', () => {
//   it('An async test', async () => {
//     return import("http://localhost:3101/remoteEntry.js")
//       .then(() => {
//         expect(true).to.be.true;
//       })
//       .catch((e) => {
//         throw e;
//       })
//   });
//});

describe("When invoking __federated_reload", () => {
  describe("with no null remotes", () => {
    it("it should throw", () => {
      expect(() => {
        const plugin = new FederatedReloadWebpackPlugin({remotes:[]});
        plugin.__federated_reload();
      }).to.throw("Cannot read property 'forEach' of undefined");
    });
  });
});

describe("When invoking apply", () => {
  describe("with null", () => {
    it("it should throw", () => {
      expect(() => {
        new FederatedReloadWebpackPlugin();
      }).to.throw("Cannot read property 'remotes' of undefined");
    });
  });
  describe("with null remotes", () => {
    it("the class variable should be undefined", () => {
      const plugin = new FederatedReloadWebpackPlugin({});
      expect(plugin._remotes).to.equal(undefined);
    });
  });
  describe("with remotes", () => {
    it("it should be assigned to the class variable", () => {
      const remotes = [];
      const options = { remotes };
      const plugin = new FederatedReloadWebpackPlugin(options);
      expect(plugin._remotes).to.equal(remotes);
    });
  });
});
