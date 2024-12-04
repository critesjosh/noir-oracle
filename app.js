import { JSONRPCServer } from "json-rpc-2.0";
import express from "express";
import bodyParser from "body-parser";

// export type ForeignCallSingle = string;

// export type ForeignCallArray = string[];

// export type ForeignCallResult = {
//     values: (ForeignCallSingle | ForeignCallArray)[];
// };

const app = express();
app.use(bodyParser.json());

const server = new JSONRPCServer();

server.addMethod("resolve_foreign_call", async (params) => {
    console.log(params);
    if (params[0].function !== "getSqrt") {
        throw Error("Unexpected foreign call")
    };
    const values = params[0].inputs[0].map((field) => {
        return `${Math.sqrt(parseInt(field, 16))}`;
    });
    console.log(values);
    return { values: [values] };
});

app.post("/", (req, res) => {
    const jsonRPCRequest = req.body;
    console.log(jsonRPCRequest);
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        if (jsonRPCResponse) {
            res.json(jsonRPCResponse);
        } else {
            res.sendStatus(204);
        }
    });
});
console.log("Listening on port 5555");

app.listen(5555);