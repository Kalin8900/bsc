export interface EventInteractionsConfig {
  coolDown: number;
  max: number;
}

export default (): { eventInteractions: EventInteractionsConfig } => ({
  eventInteractions: {
    coolDown: Number(process.env.EVENT_INTERACTIONS_COOL_DOWN) || 1, // seconds
    max: 5
  }
});
