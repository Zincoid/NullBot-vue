<template>
  <div class="filing-info">
    <span>
      <img src="../assets/filing_icon.png" alt="" class="filing-icon">
      <a href="https://beian.mps.gov.cn/#/query/webSearch?code=21021702000850" rel="noreferrer" target="_blank"
        class="filing-link filing-link-gongan">辽公网安备21021702000850号</a>
      <a href="https://beian.miit.gov.cn/" target="_blank"
        class="filing-link filing-link-icp">辽ICP备2026000475号-1</a>
    </span>
  </div>
</template>

<style scoped>
.filing-info {
  width: 100%;
  text-align: center;
  padding: 10px 0;

  background-color: #000;
  flex-shrink: 0;
}

.filing-icon {
  width: 14px;
  vertical-align: middle;
}

.filing-link {
  font-size: 13px;
  text-decoration: none;
  color: white;
}

.filing-link:hover {
  text-decoration: underline;
  color: #007bff;
}

.filing-link-gongan {
  margin-left: 6px;
}

.filing-link-icp {
  margin-left: 20px;
}
</style>
