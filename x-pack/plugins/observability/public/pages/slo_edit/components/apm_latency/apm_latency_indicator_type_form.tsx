/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useEffect } from 'react';
import { EuiFieldNumber, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiIconTip } from '@elastic/eui';
import { Controller, useFormContext } from 'react-hook-form';
import { i18n } from '@kbn/i18n';
import type { CreateSLOInput } from '@kbn/slo-schema';

import { useFetchApmIndex } from '../../../../hooks/slo/use_fetch_apm_indices';
import { FieldSelector } from '../apm_common/field_selector';
import { QueryBuilder } from '../common/query_builder';

export function ApmLatencyIndicatorTypeForm() {
  const { control, setValue, watch, getFieldState } = useFormContext<CreateSLOInput>();
  const { data: apmIndex } = useFetchApmIndex();
  useEffect(() => {
    setValue('indicator.params.index', apmIndex);
  }, [apmIndex, setValue]);

  return (
    <EuiFlexGroup direction="column" gutterSize="l">
      <EuiFlexGroup direction="row" gutterSize="l">
        <FieldSelector
          allowAllOption={false}
          label={i18n.translate('xpack.observability.slo.sloEdit.apmLatency.serviceName', {
            defaultMessage: 'Service name',
          })}
          placeholder={i18n.translate(
            'xpack.observability.slo.sloEdit.apmLatency.serviceName.placeholder',
            {
              defaultMessage: 'Select the APM service',
            }
          )}
          fieldName="service.name"
          name="indicator.params.service"
          dataTestSubj="apmLatencyServiceSelector"
          tooltip={
            <EuiIconTip
              content={i18n.translate('xpack.observability.slo.sloEdit.apm.serviceName.tooltip', {
                defaultMessage: 'This is the APM service monitored by this SLO.',
              })}
              position="top"
            />
          }
        />
        <FieldSelector
          label={i18n.translate('xpack.observability.slo.sloEdit.apmLatency.serviceEnvironment', {
            defaultMessage: 'Service environment',
          })}
          placeholder={i18n.translate(
            'xpack.observability.slo.sloEdit.apmLatency.serviceEnvironment.placeholder',
            {
              defaultMessage: 'Select the environment',
            }
          )}
          fieldName="service.environment"
          name="indicator.params.environment"
          dataTestSubj="apmLatencyEnvironmentSelector"
        />
      </EuiFlexGroup>

      <EuiFlexGroup direction="row" gutterSize="l">
        <FieldSelector
          label={i18n.translate('xpack.observability.slo.sloEdit.apmLatency.transactionType', {
            defaultMessage: 'Transaction type',
          })}
          placeholder={i18n.translate(
            'xpack.observability.slo.sloEdit.apmLatency.transactionType.placeholder',
            {
              defaultMessage: 'Select the transaction type',
            }
          )}
          fieldName="transaction.type"
          name="indicator.params.transactionType"
          dataTestSubj="apmLatencyTransactionTypeSelector"
        />
        <FieldSelector
          label={i18n.translate('xpack.observability.slo.sloEdit.apmLatency.transactionName', {
            defaultMessage: 'Transaction name',
          })}
          placeholder={i18n.translate(
            'xpack.observability.slo.sloEdit.apmLatency.transactionName.placeholder',
            {
              defaultMessage: 'Select the transaction name',
            }
          )}
          fieldName="transaction.name"
          name="indicator.params.transactionName"
          dataTestSubj="apmLatencyTransactionNameSelector"
        />
      </EuiFlexGroup>

      <EuiFlexGroup direction="row" gutterSize="l">
        <EuiFlexItem>
          <EuiFormRow
            label={
              <span>
                {i18n.translate(
                  'xpack.observability.slo.sloEdit.apmLatency.threshold.placeholder',
                  { defaultMessage: 'Threshold (ms)' }
                )}{' '}
                <EuiIconTip
                  content={i18n.translate(
                    'xpack.observability.slo.sloEdit.apmLatency.threshold.tooltip',
                    {
                      defaultMessage:
                        'Configure the threshold in milliseconds defining the "good" or "successful" requests for the SLO.',
                    }
                  )}
                  position="top"
                />
              </span>
            }
            isInvalid={getFieldState('indicator.params.threshold').invalid}
          >
            <Controller
              shouldUnregister
              name="indicator.params.threshold"
              control={control}
              defaultValue={250}
              rules={{
                required: true,
                min: 0,
              }}
              render={({ field: { ref, ...field }, fieldState }) => (
                <EuiFieldNumber
                  {...field}
                  required
                  isInvalid={fieldState.invalid}
                  value={String(field.value)}
                  data-test-subj="apmLatencyThresholdInput"
                  min={0}
                  onChange={(event) => field.onChange(Number(event.target.value))}
                />
              )}
            />
          </EuiFormRow>
        </EuiFlexItem>
        <EuiFlexItem>
          <QueryBuilder
            control={control}
            dataTestSubj="apmLatencyFilterInput"
            indexPatternString={watch('indicator.params.index')}
            label={i18n.translate('xpack.observability.slo.sloEdit.apmLatency.filter', {
              defaultMessage: 'Query filter',
            })}
            name="indicator.params.filter"
            placeholder={i18n.translate(
              'xpack.observability.slo.sloEdit.apmLatency.filter.placeholder',
              {
                defaultMessage: 'Custom filter to apply on the index',
              }
            )}
            tooltip={
              <EuiIconTip
                content={i18n.translate('xpack.observability.slo.sloEdit.apm.filter.tooltip', {
                  defaultMessage:
                    'This KQL query is used to filter the APM metrics on some relevant criteria for this SLO.',
                })}
                position="top"
              />
            }
          />
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiFlexGroup>
  );
}
