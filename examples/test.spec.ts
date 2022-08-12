import 'jest';
import { ChainTester } from "chaintester"

async function deployContract(tester: ChainTester, testName: string) {
    return tester.deployContract("hello", `${testName}/target/${testName}.wasm`, `${testName}/target/${testName}.abi`);
}

it('test finalizer', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await deployContract(tester, "finalizer");
        expect(ret.except).toBeUndefined();

        ret = await tester.pushAction("hello", "sayhello", {}, {"hello": "active"});
        expect(ret.except).toBeUndefined();
    } finally {
        await tester.free();
    }
})

it('test singleton', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await deployContract(tester, "singleton");
        expect(ret.except).toBeUndefined();

        for (var i=0; i<5; i++) {
            ret = await tester.pushAction("hello", "test", {}, {"hello": "active"});
            expect(ret.except).toBeUndefined();
            await tester.produceBlock();    
        }
    } finally {
        await tester.free();
    }
})


// @chain_test
// def test_notify():
//     with open('./notify/target/sender.wasm', 'rb') as f:
//         code = f.read()
//     with open('./notify/target/sender.abi', 'rb') as f:
//         abi = f.read()
//     chain.deploy_contract('hello', code, abi, 0)


//     with open('./notify/target/receiver.wasm', 'rb') as f:
//         code = f.read()
//     with open('./notify/target/receiver.abi', 'rb') as f:
//         abi = f.read()
//     chain.deploy_contract('helloworld11', code, abi, 0)

//     args = {
//         'name': 'alice'
//     }
//     r = chain.push_action('hello', 'sayhello', args, {'hello': 'active'})


it('test notify', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await tester.deployContract("hello", "./notify/target/sender.wasm", "./notify/target/sender.abi");
        expect(ret.except).toBeUndefined();

        ret = await tester.deployContract("helloworld11", "./notify/target/receiver.wasm", "./notify/target/receiver.abi");
        expect(ret.except).toBeUndefined();

        ret = await tester.pushAction("hello", "sayhello", {name: 'alice'}, {"hello": "active"});
        expect(ret.except).toBeUndefined();
        await tester.produceBlock();    
    } finally {
        await tester.free();
    }
})

it('test codegeneration', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await deployContract(tester, "codegeneration");
        expect(ret.except).toBeUndefined();

        ret = await tester.pushAction("hello", "count", {a1: 1, a2: 2, a3: 'aabb'}, {"hello": "active"});
        expect(ret.except).toBeUndefined();
        await tester.produceBlock();    
    } finally {
        await tester.free();
    }
})

it('test counter', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await deployContract(tester, "counter");
        expect(ret.except).toBeUndefined();

        for (var i=0; i<10; i++) {
            ret = await tester.pushAction("hello", "inc", {}, {"hello": "active"});
            expect(ret.except).toBeUndefined();
            await tester.produceBlock();    
        }
    } finally {
        await tester.free();
    }
})

it('test action', async () => {
    let tester = new ChainTester();
    await tester.init();
    let updateauth_args = {
        "account": "hello",
        "permission": "active",
        "parent": "owner",
        "auth": {
            "threshold": 1,
            "keys": [
                {
                    "key": "EOS6AjF6hvF7GSuSd4sCgfPKq5uWaXvGM2aQtEUCwmEHygQaqxBSV",
                    "weight": 1
                }
            ],
            "accounts": [{"permission":{"actor": "hello", "permission": "eosio.code"}, "weight":1}],
            "waits": []
        }
    };

    let ret = await tester.pushAction("eosio", "updateauth", updateauth_args, {"hello": "active"});
    expect(ret.except).toBeUndefined();
    await tester.produceBlock();

    try {
        let ret = await deployContract(tester, "inlineaction");
        expect(ret.except).toBeUndefined();

        for (var i=0; i<10; i++) {
            ret = await tester.pushAction("hello", "sayhello", {name: 'bob'}, {"hello": "active"});
            expect(ret.except).toBeUndefined();
            await tester.produceBlock();    
        }
    } finally {
        await tester.free();
    }
})

it('test hello', async () => {
    let tester = new ChainTester();
    await tester.init();
    try {
        let ret = await deployContract(tester, "hello");
        expect(ret.except).toBeUndefined();

        ret = await tester.pushAction("hello", "sayhello", {}, {"hello": "active"});
        expect(ret.except).toBeUndefined();
        await tester.produceBlock();    
    } finally {
        await tester.free();
    }
})