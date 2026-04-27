<template>
  <div class="setup-banner">
    <strong>Setup needed:</strong> copy <code>.env.example</code> to <code>.env</code> and fill in
    your Lambda API URL + VAPID public key, then rebuild. See <code>README.md</code> for instructions.
  </div>
</template>

<style scoped>
.setup-banner {
  background: rgba(224, 184, 99, 0.06);
  border: 1px solid rgba(224, 184, 99, 0.25);
  border-radius: 4px;
  padding: 14px 18px;
  margin-bottom: 24px;
  font-family: var(--mono);
  font-size: 11px;
  color: var(--warn);
  line-height: 1.7;
}

.setup-banner strong { color: #f0d090; }
</style>
