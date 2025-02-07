import { tool } from 'ai';
import { z } from 'zod';

export const getWeather = tool({
  description: 'Get the current weather at a location',
  parameters: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  execute: async ({ latitude, longitude }) => {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});

export const getNycWeather = tool({
  description: 'Get the current weather in New York City',
  parameters: z.object({}),
  execute: async () => {
    const nycLat = process.env.NYC_LAT;
    const nycLng = process.env.NYC_LNG;
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${nycLat}&longitude=${nycLng}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
    );

    const weatherData = await response.json();
    return weatherData;
  },
});