//var worker = require('node_helper');
//console.log("params:", worker.params);
//console.log("config:", worker.config);
//console.log("task_id:", worker.task_id);

// This is the 
var TransloaditClient = require('transloadit');
var transloadit       = new TransloaditClient({
  authKey    : 'febb5ba0df6511e4b6c85b881c054f80',
  authSecret : '8715b483383b5c141e07421914a8325a2f6e7ac5'
});

var assemblyOptions = {
  params: {
    template_id: 'f0fdc840e85711e4b608fdc694e171ba'
  }
};
transloadit.createAssembly(assemblyOptions, function(err, result) {
  if (err) {
    throw new Error(err);
  }

  console.log('success');
//
//  var assemblyId = result.assembly_id;
//  console.log({
//    assemblyId: assemblyId
//  });

//  transloadit.deleteAssembly(assemblyId, function(err) {
//    console.log('deleted');
//  });
});