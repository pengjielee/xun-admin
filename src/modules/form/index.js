import { useEffect, useState, useRef, useCallback } from "react";
import { sendCode, signUpActivity } from "@/services";
import { useForm } from "react-hook-form";
import * as dayjs from "dayjs";
import DatePicker from "react-mobile-datepicker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Forms(props) {
  const { data, brickId } = props;
  const [showSuccess, setShowSuccess] = useState(false);
  const [submiting, setSubmiting] = useState(false);

  const inputs = (data && data.inputs) || [];
  const {
    mode,
    successBtnText,
    successBtnHref,
    successContent,
    successTitle,
    successQrImg,
    submitBtnText,
  } = data;

  const timerRef = useRef(null);
  const fieldRef = useRef(null);

  const [count, setCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (count === 59) {
      timerRef.current = setInterval(() => {
        setCount((preCount) => preCount - 1);
      }, 1000);
    } else if (count === 0) {
      clearInterval(timerRef.current);
    }
  }, [count]);

  const startTimer = useCallback(() => {
    setCount(59);
  }, []);

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    if (submiting) {
      return;
    }

    setSubmiting(true);
    const { mobile, vcode, ...rest } = data;

    const submitData = {
      mobile: mobile,
      vcode: vcode,
      brickId: brickId,
      extra: JSON.stringify(rest),
    };

    console.log(submitData);

    // signUpActivity(submitData)
    //   .then((res) => {
    //     const { code, isSuccess, msg } = res.data;
    //     if (code === 200 && isSuccess) {
    //       setShowSuccess(true);
    //       reset();
    //     } else {
    //       toast.error(msg || "报名失败");
    //     }
    //   })
    //   .catch((e) => toast.error("出错了"))
    //   .finally(() => setTimeout(() => setSubmiting(false), 3000));
  };

  const handleDateClick = (label) => {
    fieldRef.current = label;
    const values = getValues();
    const time = values[label];
    if (time) {
      setTime(new Date(time));
    }

    setIsOpen(true);
  };

  const handleDateSelect = (date) => {
    const value = dayjs(date).format("YYYY-MM-DD");
    const fields = Object.assign({}, getValues());
    fields[fieldRef.current] = value;
    reset(fields);
    setIsOpen(false);
  };

  const handleSendCode = () => {
    const { mobile } = getValues();

    if (mobile.length <= 0) {
      return;
    }
    if (!/^1[\d]{10}$/g.test(mobile)) {
      toast.info("请填写正确的手机号");
      return;
    }
    setSubmiting(true);

    // sendCode({ mobile })
    //   .then((res) => {
    //     if (res.data.isSuccess) {
    //       toast.info(`6位数验证码已通过短信发送手机号${mobile}，请注意查收`);
    //       startTimer();
    //     } else {
    //       toast.info("验证码发送失败，请稍后再尝试");
    //     }
    //   })
    //   .catch((e) => toast.error("出错了"))
    //   .finally(() => setTimeout(() => setSubmiting(false), 3000));
  };

  const renderInput = (item) => {
    const { label, placeholder, type, options } = item;

    if (!label) {
      return;
    }

    let Element = null;

    const Items =
      options &&
      options.split(",").map((item, index) => {
        return (
          <option key={index} value={item}>
            {item}
          </option>
        );
      });

    switch (type) {
      case "date":
        Element = (
          <div
            className="form-date"
            {...register(`${label}`, { required: true })}
            placeholder={placeholder}
            onClick={() => handleDateClick(label)}
          >
            {getValues(`${label}`) || placeholder}
          </div>
        );
        break;
      case "select":
        Element = (
          <select
            className="form-select"
            {...register(`${label}`, { required: true })}
            placeholder={placeholder}
          >
            <option value="">请选择{placeholder}</option>
            {Items}
          </select>
        );
        break;
      case "radio":
        Element = (
          <div className="form-radios">
            <label className="radio-item">
              <span>是</span>
              <input
                type="radio"
                name={label}
                value="是"
                {...register(`${label}`, { required: true })}
              />
            </label>

            <label className="radio-item">
              <span>否</span>

              <input
                type="radio"
                name={label}
                value="否"
                {...register(`${label}`, { required: true })}
              />
            </label>
          </div>
        );
        break;
      default:
        Element = (
          <input
            className="form-input"
            {...register(`${label}`, { required: true })}
            placeholder={placeholder}
          />
        );
        break;
    }

    return Element;
  };

  const renderPreviewInput = (item) => {
    const { label, placeholder, type, options } = item;

    if (!label) {
      return;
    }

    let Element = null;

    const Items =
      options &&
      options.split(",").map((item, index) => {
        return (
          <option key={index} value={item}>
            {item}
          </option>
        );
      });

    switch (type) {
      case "date":
        Element = (
          <div
            className="form-date"
            placeholder={placeholder}
            onClick={() => handleDateClick(label)}
          >
            {getValues(`${label}`) || placeholder}
          </div>
        );
        break;
      case "select":
        Element = (
          <select className="form-select" placeholder={placeholder}>
            <option value="">请选择{placeholder}</option>
            {Items}
          </select>
        );
        break;
      case "radio":
        Element = (
          <div className="form-radios">
            <label className="radio-item">
              <span>是</span>
              <input type="radio" name={label} value="是" />
            </label>

            <label className="radio-item">
              <span>否</span>

              <input type="radio" name={label} value="否" />
            </label>
          </div>
        );
        break;
      default:
        Element = <input className="form-input" placeholder={placeholder} />;
        break;
    }

    return Element;
  };

  return (
    <>
      <div id="form" className="module-forms">
        <form onSubmit={handleSubmit(onSubmit)}>
          {inputs.map((item, index) => {
            return (
              <div className="form-group" key={index}>
                <div className="form-header">
                  <label className="form-label">
                    {item.label}
                    <span className="required">*</span>
                  </label>
                  <div className="form-error">
                    {errors[item.label] && <p>请填写{item.label}</p>}
                  </div>
                </div>
                {mode && mode === "preview"
                  ? renderPreviewInput(item)
                  : renderInput(item)}
              </div>
            );
          })}

          <div className="form-group">
            <div className="form-header">
              <label className="form-label">
                手机号<span className="required">*</span>
              </label>
              <div className="form-error">
                {errors["mobile"] && <p>请填写手机号</p>}
              </div>
            </div>
            <input
              maxLength="11"
              name="mobile"
              className="form-input"
              {...register("mobile", { required: true })}
              type="text"
              placeholder="11位手机号码"
            />
          </div>
          <div className="form-group form-vcode">
            <div className="form-inline">
              <input
                maxLength="6"
                name="vcode"
                className="form-input"
                {...register("vcode", { required: true })}
                type="text"
                placeholder="6位验证码"
              />

              <button
                className="btn-send-code theme-btn"
                disabled={!!count}
                onClick={() => handleSendCode()}
              >
                {count ? `${count}s` : "获取验证码"}
              </button>
            </div>
            <div className="form-error" style={{ marginTop: "3px" }}>
              {errors["vcode"] && <p>请填写验证码</p>}
            </div>
          </div>

          <DatePicker
            theme="ios"
            value={time}
            isOpen={isOpen}
            onSelect={(date) => handleDateSelect(date)}
            onCancel={() => setIsOpen(false)}
          />

          <div className="form-submit">
            <button
              disabled={submiting}
              className="btn-submit theme-btn"
              type="submit"
            >
              {submitBtnText || "提交"}
            </button>
          </div>
        </form>

        <ToastContainer
          position="top-left"
          autoClose={2000}
          hideProgressBar={true}
        />
      </div>
      {showSuccess ? (
        <>
          <div className="page-success">
            <img
              className="success-icon"
              src="https://of.xmfile.cn/pro/mkt_resource/20210608/9d3ec9a2d9464b1c880b4cd2854c213d.png"
            />
            <h2 className="success-title">{successTitle || "资料提交成功"}</h2>
            <div className="success-content">
              {successContent || "提交成功"}
            </div>
            {successQrImg ? (
              <img src={successQrImg} className="success-qrimg" />
            ) : null}
            <a className="success-link" href={successBtnHref}>
              {successBtnText || "返回首页"}
            </a>
          </div>
        </>
      ) : null}
    </>
  );
}
