import { CompositePropagator } from '@opentelemetry/core';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { Resource } from '@opentelemetry/resources';
// import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import process from 'process';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

const otelSDK = new NodeSDK({
  // metricExporter: new PrometheusExporter({
  //   port: 8081,
  // }),
  // metricInterval: 1000,
  spanProcessor: new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://101.34.66.96:14268/api/traces',
    }),
  ),
  // spanProcessor: new BatchSpanProcessor(
  //   new ZipkinExporter({
  //     url: 'http://101.34.66.96:19411/api/v2/spans',
  //   }),
  // ),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'nest-shop',
  }),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [new JaegerPropagator('nest-shop-trace-id')],
  }),
});

export default otelSDK;
// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
