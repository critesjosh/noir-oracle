import { JSONRPCClient } from "json-rpc-2.0";
import { Noir } from '@noir-lang/noir_js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const circuitFile = readFileSync(resolve('circuit/target/noirstarter.json'), 'utf-8');
const circuit = JSON.parse(circuitFile);

let noir = new Noir(circuit);

// declaring the JSONRPCClient
const client = new JSONRPCClient((jsonRPCRequest) => {
    // hitting the same JSON RPC Server we coded above
    return fetch("http://localhost:5555", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(jsonRPCRequest),
    }).then((response) => {
        if (response.status === 200) {
            return response
                .json()
                .then((jsonRPCResponse) => client.receive(jsonRPCResponse));
        } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
        }
    });
});

// declaring a function that takes the name of the foreign call (getSqrt) and the inputs
const foreignCallHandler = async (name, input) => {
    const inputs = input[0].map((i) => i.toString("hex"))
    // notice that the "inputs" parameter contains *all* the inputs
    // in this case we to make the RPC request with the first parameter "numbers", which would be input[0]
    const oracleReturn = await client.request("resolve_foreign_call", [
        {
            function: name,
            inputs: [inputs]
        },
    ]);
    return [oracleReturn.values[0]];
};

// the rest of your NoirJS code
const input = { input: [4, 16] };
const { witness } = await noir.execute(input, foreignCallHandler);
console.log(witness);