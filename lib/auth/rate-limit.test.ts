import assert from "node:assert/strict";
import test from "node:test";
import { checkLoginRateLimit, resetLoginRateLimit } from "./rate-limit";
test("bloqueia a sexta tentativa na janela",()=>{const key="test-ip";resetLoginRateLimit(key);for(let i=0;i<5;i++)assert.equal(checkLoginRateLimit(key,1000).allowed,true);assert.equal(checkLoginRateLimit(key,1000).allowed,false);resetLoginRateLimit(key)});
