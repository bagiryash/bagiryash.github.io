let type = "1";
let width = 0, height = 0, depth = 0;
let t;
$(function() {
    $(".calculator .nav a.nav-link").click(function() {
        $(".calculator .nav-item.show").removeClass("show");
        $(".preview.show").removeClass("show");
        $(".calculator-form.show").removeClass("show");

        let typeLink = $(this).attr("data-type-link");
        // console.log( $(this).attr("data-type-link"));
        $("." + typeLink).addClass("show");
        if (typeLink == "calc-kitchen") {
            type = "2";
        } else  {
            type = "1";
        }

        setTimeout(function() {
            fillSizes();
            refreshSum();
        }, 100);
    })

    $(".calc-input").on("keyup", function () {
        var $this = $(this);
        clearInterval(t);
        t = setTimeout(function() {
            if ($this.closest(".calculator-form").hasClass("show")) {
                var $preview = $(".preview.show");
                var link = $this.attr("data-link");

                console.log('span', $preview.find(".size." + link).children("span").text());
                animateValue($preview.find(".size." + link).children("span"), $this.val());
                fillSizes();
                refreshSum();
            }
        }, 500);
    })

    $(".calc-input").on("change", function () {
        var $this = $(this);
        if ($this.closest(".calculator-form").hasClass("show")) {
            var value = parseInt($this.val());
            var min = parseInt($this.attr("min")) || 10;
            var max = parseInt($this.attr("max")) || 1000;
            var $preview = $(".preview.show");
            var link = $this.attr("data-link");

            if (value < min) {
                $this.val(min)
                animateValue($preview.find(".size." + link).children("span"), $this.val());
                fillSizes();
                refreshSum()
            } else if (value > max) {
                $this.val(max);
                animateValue($preview.find(".size." + link).children("span"), $this.val());
                fillSizes();
                refreshSum()
            }
        }
    });

    fillSizes();
    refreshSum();
})

const data = {
    "1": { // wardrobe
        base: 3000,
        per100cm: 2500,
        baseCoef: 2.45 * 0.55
    },
    "2": { // kitchen
        base: 5000,
        per100cm: 4200,
        baseCoef: 2.45 * 0.55
    },
}

function fillSizes() {
    let $cal = $(".calculator-form.show");
    width = parseInt($cal.find(".calc-input.width").val() || 0);
    height = parseInt($cal.find(".calc-input.height").val() || 245);
    depth = parseInt($cal.find(".calc-input.depth").val() || 55);
    console.log(width, height, depth);
}

function refreshSum() {
    console.log("Refresh sum", width, height, depth);
    calculate(width, height, depth);
}

function calculate(width, height = 245, depth = 55) {
    let $sum = $("#sum-info");
    let info = data[type];
    var coef =  ((height/100) * (depth/100)) / info.baseCoef;
    if (coef < 0.8) {
        coef = 0.8;
    }

    let sum = info.base + info.per100cm * width/100 * coef;
    console.log("sum", sum, info, coef);
    animateValue($sum.children("span"), sum, 500);
}

// let timer;

function animateValue(selector, end, duration = 300) {
    // assumes integer values for start and end
    end = Math.round(end);
    var timer = 0;
    var obj = $(selector);
    clearInterval(obj.attr("timer"));


    var range = end - parseInt(obj.text());
    console.log("obj", obj, end, range);
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));

    // never go below minTimer
    stepTime = Math.max(stepTime, minTimer);

    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;

    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        console.log(value);
        obj.text(value);
        if (value == end) {
            clearInterval(timer);
        }
    }

    timer = setInterval(run, stepTime);
    obj.attr("timer", timer);
    console.log("timer", timer);
    run();
}
