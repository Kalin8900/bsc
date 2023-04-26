import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { MonitoringInterceptor } from './monitoring.interceptor';

/**
 * Applies the `MonitoringInterceptor` to the decorated class or method.
 * It increments the request count and observes the request duration.
 */
export const Monitor = () => applyDecorators(UseInterceptors(MonitoringInterceptor));

export const DEPENDENCY_METADATA_KEY = Symbol('DependencyMetadataKey');
/**
 * Decorator to mark a class as a dependency for monitoring. It requires the class to implement the `MonitoringDependency` interface.
 * You can also provide a custom name for the dependency.
 */
export const Dependency = (name?: string) => applyDecorators(SetMetadata(DEPENDENCY_METADATA_KEY, name ?? true));

/**
 * Key under which the custom metric updater metadata is stored.
 * To apply method as custom metric updater, use `@MetricUpdater()` decorator or set this metadata with any non-null value.
 */
export const METRIC_UPDATER_METADATA_KEY = Symbol('MetricUpdaterMetadataKey');
/**
 * Decorator which marks a method as a custom metric updater which will be called on each metrics update.
 */
export const MetricUpdater = () => applyDecorators(SetMetadata(METRIC_UPDATER_METADATA_KEY, true));
