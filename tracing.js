const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-base');
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { trace } = require("@opentelemetry/api");
//Instrumentations
const { ExpressInstrumentation } = require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } = require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
//Exporter

const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

module.exports = (serviceName) => {
   const exporter = new JaegerExporter({
       serviceName: serviceName,
       host: "localhost", // Change this if Jaeger is running on a different host
       port: 6832, // Change this if the Jaeger collector port is different
   });
   
   const provider = new NodeTracerProvider({
       resource: new Resource({
           [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
       }),
   });
   
   provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
   provider.register();
   
   registerInstrumentations({
       instrumentations: [
           new ConsoleSpanExporter(),
           new HttpInstrumentation(),
           new ExpressInstrumentation(),
           new MongoDBInstrumentation(),
       ],
       tracerProvider: provider,
   });
   
   return trace.getTracer(serviceName);
};

// module.exports = (serviceName) => {
//    const exporter = new ConsoleSpanExporter();
//    const provider = new NodeTracerProvider({
//        resource: new Resource({
//            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
//        }),
//    });
//    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
//    provider.register();
//    registerInstrumentations({
//        instrumentations: [
//            new HttpInstrumentation(),
//            new ExpressInstrumentation(),
//            new MongoDBInstrumentation(),
//        ],
//        tracerProvider: provider,
//    });
//    return trace.getTracer(serviceName);
// };
