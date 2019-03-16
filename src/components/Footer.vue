<template>
  <footer>
    <div :class="[$style.wrapper]">
      <div :class="[$style.wrapper__row]">
        <div  :class="[$style.col]">
          <div :class="[$style.header]">КОНТАКТЫ</div>
          <ul :class="[$style.list]">
            <li>
              <a href="http://cendop.bmstu.ru/" target="_blank">
                <span>Сайт оргкомитета олимпиады</span>
              </a>
            </li>
            <li>
              <a href="http://bmstu.ru/" target="_blank">
                <span>Сайт МГТУ им. Н.Э. Баумана</span>
              </a>
            </li>
          </ul>
        </div>
        <div  :class="[$style.col]">
          <div :class="[$style.header]">ТЕХПОДДЕРЖКА</div>
          <ul :class="[$style.list]">
            <li>
              <a href="mailto:stroganovyv@bmstu.ru">
                <i class="fas fa-envelope"></i>
                <span>stroganovyv@bmstu.ru</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div :class="[$style.copyright]">
      © 2010–2019 МГТУ им. Н. Э. Баумана
      Все права защищены
    </div>
  </footer>
</template>

<script>
export default {

}
</script>

<style module lang="scss">
@import '../styles/base.scss';

footer {
  height: $size-footer;
  background: $color-bg;
}

.wrapper {
  display: table;

  &__row {
    display: table-row;
  }
}

.col {
  display: table-cell;
  padding: $padding-base * 2;
}

.header {
  color: $color-text;
  border-bottom: 2px solid $color-text;
  margin-bottom: $margin-base / 2;
  @include fontSize5();
}

.list {
  list-style-type: none;
  margin: 0;
  padding: 0;

  & > li {
    margin: 0;
    padding: $padding-list;

    a {
      @include linkSecondary();
      &:hover span {
        text-decoration: underline;
      }
    }
  }
}

.copyright {
  background: $color-bg-ld;
  text-align: center;
  padding: $padding-base / 4 0;
  @include fontSize1();
}

@media screen and (max-width: 800px) {
  .wrapper, .wrapper__row, .col {
    display: block;
  }

  .col {
    padding: $padding-base / 2;
  }
}
</style>
