/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { CLOSE_ALERT_BTN, MARK_ALERT_ACKNOWLEDGED_BTN, OPEN_ALERT_BTN } from '../screens/alerts';
import {
  ALERT_FLYOUT,
  ENRICHMENT_COUNT_NOTIFICATION,
  JSON_VIEW_TAB,
  TABLE_TAB,
  FILTER_INPUT,
  OVERVIEW_STATUS,
  EVENT_DETAILS_ALERT_STATUS_POPOVER,
} from '../screens/alerts_details';
import { TIMELINE_TITLE, QUERY_TAB_BUTTON } from '../screens/timeline';

export const filterBy = (value: string) => {
  cy.get(FILTER_INPUT).type(value);
};

export const openJsonView = () => {
  cy.get(JSON_VIEW_TAB).click();
};

export const openTable = () => {
  cy.get(TABLE_TAB).click();
};

export const openThreatIndicatorDetails = () => {
  cy.get(ENRICHMENT_COUNT_NOTIFICATION).click();
};

export const verifyInsightCount = ({
  tableSelector,
  investigateSelector,
}: {
  tableSelector: string;
  investigateSelector: string;
}) => {
  cy.get(tableSelector).click();

  // Make sure the table containing data has loaded before parsing the text for the alert count
  cy.get(investigateSelector);
  cy.get(tableSelector)
    .invoke('text')
    .then((relatedAlertsByAncestryText) => {
      // Extract the count from the text
      const alertCount = relatedAlertsByAncestryText.match(/(\d)/);
      const actualCount = alertCount && alertCount[0];

      // Make sure we can see the table
      cy.contains('New Rule Test').should('be.visible');

      // Click on the first button that lets us investigate in timeline
      cy.get(ALERT_FLYOUT).find(investigateSelector).click();

      // Make sure a new timeline is created and opened
      cy.get(TIMELINE_TITLE).should('contain.text', 'Untitled timeline');

      // The alert count in this timeline should match the count shown on the alert flyout
      cy.get(QUERY_TAB_BUTTON).should('contain.text', actualCount);
    });
};

export const changeAlertStatusTo = (status: 'open' | 'closed' | 'acknowledged') => {
  cy.get(OVERVIEW_STATUS).trigger('click');
  cy.get(EVENT_DETAILS_ALERT_STATUS_POPOVER).should('be.visible');

  if (status === 'acknowledged') {
    cy.get(MARK_ALERT_ACKNOWLEDGED_BTN).should('be.visible').trigger('click');
    return;
  }
  if (status === 'open') {
    cy.get(OPEN_ALERT_BTN).should('be.visible').trigger('click');
  }

  if (status === 'closed') {
    cy.get(CLOSE_ALERT_BTN).should('be.visible').trigger('click');
  }
};
