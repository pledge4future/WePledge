import { gql } from "@apollo/client";

export const GET_TOTAL_EMISSIONS = gql`
  query getTotalEmissions($level: String!, $timeInterval: String!) {
    commutingAggregated (level: $level, timeInterval: $timeInterval) {
      co2e
      co2eCap
      date
    }
  businesstripAggregated (level: $level, timeInterval: $timeInterval) {
      co2e
      co2eCap
      date
    }
    heatingAggregated (level: $level, timeInterval: $timeInterval) {
      co2e
      co2eCap
      date
    }
    electricityAggregated (level: $level, timeInterval: $timeInterval) {
      co2e
      co2eCap
      date
    }
  }
  `