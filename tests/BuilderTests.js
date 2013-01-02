/**
 * Copyright (c) 2013, Dan Eyles (dan@irlgaming.com)
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the <organization> nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var sculedb = require('../lib/com.scule.db');
var build   = require('../lib/com.scule.db.builder');
var inst    = require('../lib/com.scule.instrumentation');
var jsunit  = require('../lib/com.scule.jsunit');

function testProgramBuilder() {
    var collection = sculedb.factoryCollection('scule+dummy://test');
    
    var director = build.getProgramDirector();
    var builder  = build.getProgramBuilder();

    director.setProgramBuilder(builder);
    
    var program = director.getProgram();
    
    program.startHeadBlock();
    program.startScanBlock(collection, []);
    program.stopBlock();
    
    program.startLoopBlock();
    program.startAndBlock();
    program.addInstruction('eq', ['a', 5]);
    program.addInstruction('gt', ['b', 300]);
    program.startOrBlock();
    program.startAndBlock();
    program.addInstruction('eq', ['a', 7]);
    program.stopBlock();
    program.startAndBlock();
    program.addInstruction('eq', ['a', 9]);
    program.stopBlock();    
    program.stopBlock();
    program.stopBlock();
    program.stopBlock();
    
    director.explainProgram();
};

function testQueryCompiler() {
    var collection = sculedb.factoryCollection('scule+dummy://test');
    collection.ensureBTreeIndex('a,b');
    collection.ensureHashIndex('c');
    collection.ensureBTreeIndex('c');

    var compiler = build.getQueryCompiler();
    // {a:3, b:4, c:{$gt:300}}
    compiler.explainQuery({a:3, b:4, c:{$gt:300}}, {$limit:10, $sort:{a:-1}}, collection);
};

(function() {
    jsunit.resetTests(__filename);
//    jsunit.addTest(testProgramBuilder);
    jsunit.addTest(testQueryCompiler);
    jsunit.runTests();
}());