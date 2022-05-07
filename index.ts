import * as fs from 'fs';
// We don't have type definitions for solc-js yet; https://github.com/ethereum/solc-js/issues/578
// To avoid improt error we use pure js require function.
const solc = require('solc');

const compile = async (fileName: string, contractName: string) => {
  const file = fs.readFileSync(fileName).toString();
  const output = 'input.sol';
  // https://docs.soliditylang.org/en/v0.8.13/using-the-compiler.html#compiler-input-and-output-json-description
  const input = {
    language: 'Solidity',
    sources: {
      [output]: {
        content: file,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        [output]: {
          '*': ['evm.bytecode.object', 'abi', 'evm.deployedBytecode'],
        },
      },
    },
  };

  const out = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
  const contract = out.contracts[output][contractName];
  return { bytecode: `0x${contract.evm.bytecode.object}`, abi: contract.abi };
};

const importCache: { [key: string]: { contents: string } } = {};
const findImports = (path: string) => {
  if (importCache[path] == null) {
    const file = fs.readFileSync(`node_modules/${path}`);
    importCache[path] = {
      contents: file.toString(),
    };
  }
  return importCache[path];
};

const demo = async () => {
  const res = await compile('sample.sol', 'DemoContract');
  console.log(res);
};

demo();
